import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';
import Model3D from '../models3d/model3d.model';

class ARExperience extends Model {
  public id!: string;
  public modelId!: string;
  public slug!: string;
  public qrCodeData!: string;
  public viewsCount!: number;
}

ARExperience.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  modelId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: { model: Model3D, key: 'id' }
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  qrCodeData: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  viewsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
}, {
  sequelize,
  modelName: 'ARExperience',
});

Model3D.hasOne(ARExperience, { foreignKey: 'modelId' });
ARExperience.belongsTo(Model3D, { foreignKey: 'modelId' });

export default ARExperience;
