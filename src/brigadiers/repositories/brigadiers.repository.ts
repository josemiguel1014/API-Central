import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { IBrigadiersRepository } from '../interfaces/brigadiers.repository.interface';
import { BrigadeMember } from '../models/brigadiers.model';
import { plainToClass } from 'class-transformer';
import { KeyVaultService } from '../../context_db/DbContext.service';
import { Community } from '../../community/models/community.model';

@Injectable()
export class BrigadiersRepository implements IBrigadiersRepository {
  private databaseId = 'risk_management';
  private containerId = 'brigadiers';

  constructor(
    @Inject(KeyVaultService) private readonly client: KeyVaultService,
  ) {}

  async GetAllBrigadiers(): Promise<BrigadeMember[]> {
    try {
      // Query
      const querySpec = {
        query: 'SELECT * FROM c',
      };

      // Consulta
      const { resources: items } = await this.client
        .getDbConnection()
        .database(this.databaseId)
        .container(this.containerId)
        .items.query(querySpec)
        .fetchAll();

      return items.map((item: BrigadeMember) =>
        plainToClass(BrigadeMember, item),
      );
    } catch (e) {
      throw new BadGatewayException('Error en GetAllCommunity ' + e);
    }
  }

  async GetBrigadiersById(id: string) {
    try {
      // Consulta
      const { resource: item } = await this.client
        .getDbConnection()
        .database(this.databaseId)
        .container(this.containerId)
        .item(id, BrigadeMember.GetPartitionKey())
        .read();

      return plainToClass(Community, item);
    } catch (e) {
      throw new BadGatewayException('Error en GetBrigadiersById ' + e);
    }
  }
}