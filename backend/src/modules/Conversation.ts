import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface ConversationAttributes {
  id: number;
  sessionId: string;
  userId?: number | null;
  language: string;
  sourcePage?: string | null;
  status: "open" | "closed";
  createdAt?: Date;
  updatedAt?: Date;
}

interface ConversationCreationAttributes
  extends Optional<ConversationAttributes, "id" | "userId" | "sourcePage" | "status"> {}

class Conversation
  extends Model<ConversationAttributes, ConversationCreationAttributes>
  implements ConversationAttributes
{
  public id!: number;
  public sessionId!: string;
  public userId!: number | null;
  public language!: string;
  public sourcePage!: string | null;
  public status!: "open" | "closed";

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Conversation.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    sessionId: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    language: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "fr",
    },
    sourcePage: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("open", "closed"),
      allowNull: false,
      defaultValue: "open",
    },
  },
  {
    sequelize,
    tableName: "conversations",
    modelName: "Conversation",
  }
);

export default Conversation;