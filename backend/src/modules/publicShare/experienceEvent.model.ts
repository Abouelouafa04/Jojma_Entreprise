import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';
import ARExperience from './experience.model';

export type ARExperienceEventType = 'open' | 'qr_scan' | 'share';

class ARExperienceEvent extends Model {
  public id!: string;
  public experienceId!: string;
  public eventType!: ARExperienceEventType;
  public deviceType!: string | null;
  public userAgent!: string | null;
  public createdAt!: Date;
  public updatedAt!: Date;
}

ARExperienceEvent.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    experienceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: ARExperience, key: 'id' },
      onDelete: 'CASCADE',
    },
    eventType: {
      type: DataTypes.ENUM('open', 'qr_scan', 'share'),
      allowNull: false,
    },
    deviceType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'ARExperienceEvent',
    indexes: [
      { fields: ['experienceId'] },
      { fields: ['eventType'] },
      { fields: ['createdAt'] },
    ],
  }
);

ARExperience.hasMany(ARExperienceEvent, { foreignKey: 'experienceId' });
ARExperienceEvent.belongsTo(ARExperience, { foreignKey: 'experienceId' });

export default ARExperienceEvent;

