import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';

class PasswordResetToken extends Model {
  public id!: string;
  public userId!: string;
  public token!: string; // hashed token
  public expiresAt!: Date;
  public createdAt!: Date;
}

PasswordResetToken.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'PasswordResetToken',
  timestamps: true,
});

export default PasswordResetToken;
