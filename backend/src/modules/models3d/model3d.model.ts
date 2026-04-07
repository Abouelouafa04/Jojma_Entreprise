import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';
import User from '../users/user.model';

class Model3D extends Model {
  public id!: string;
  public userId!: string;
  public name!: string;
  public status!: 'pending' | 'completed' | 'error';
  public sizeBytes!: number;
  public format!: string;
  public convertedFormat?: string | null;
  public convertedFileName?: string | null;
  public conversionDate?: Date | null;
  public errorMessage?: string | null;
}

Model3D.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: User, key: 'id' }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'error'),
    defaultValue: 'pending',
  },
  sizeBytes: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  format: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  convertedFormat: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  convertedFileName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  conversionDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Model3D',
});

User.hasMany(Model3D, { foreignKey: 'userId' });
Model3D.belongsTo(User, { foreignKey: 'userId' });

export default Model3D;
