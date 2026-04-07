import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';
import User from '../users/user.model';

export type ConversionJobStatus = 'pending' | 'processing' | 'success' | 'failed';

class ConversionJob extends Model {
  public id!: string;
  public userId!: string;
  public originalFileName!: string;
  public storedInputPath!: string;
  public sourceFormat!: string;
  public targetFormat!: string;
  public status!: ConversionJobStatus;
  public progress!: number;
  public outputFileName?: string | null;
  public outputFilePath?: string | null;
  public errorMessage?: string | null;
  public startedAt?: Date | null;
  public finishedAt?: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ConversionJob.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: User, key: 'id' },
    },
    originalFileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    storedInputPath: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    sourceFormat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    targetFormat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'success', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    outputFileName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    outputFilePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    finishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'ConversionJob',
    tableName: 'conversion_jobs',
    underscored: true,
  }
);

User.hasMany(ConversionJob, { foreignKey: 'userId' });
ConversionJob.belongsTo(User, { foreignKey: 'userId' });

export default ConversionJob;

