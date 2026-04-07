import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';

class SubscriptionPlan extends Model {
  public id!: string;
  public name!: string;
  public maxConversions!: number;
  public maxStorageMb!: number;
}

SubscriptionPlan.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  maxConversions: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
  },
  maxStorageMb: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
  }
}, {
  sequelize,
  modelName: 'SubscriptionPlan',
});

export default SubscriptionPlan;
