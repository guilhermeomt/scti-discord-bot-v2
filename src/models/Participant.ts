import Sequelize, { Model } from 'sequelize';
import db from '../services/Database'
import { Event } from './Event';

export class Participant extends Model {
  id: string;
  name?: string;
  nickname: string;
  email?: string;
  notionId: string;
}

Participant.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    nickname: Sequelize.STRING,
    email: Sequelize.STRING,
    notionId: Sequelize.STRING,
  },
  {
    sequelize: db.connection,
    freezeTableName: true,
  }


)


export default Participant;

