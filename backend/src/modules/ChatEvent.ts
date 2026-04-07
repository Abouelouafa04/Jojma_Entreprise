import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import Conversation from "./Conversation.js";

interface ChatEventAttributes {
  id: number;
  conversationId: number;
  eventType: "message_sent" | "reply_generated" | "lead_detected" | "blocked_message" | "error";
  payload?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ChatEventCreationAttributes
  extends Optional<ChatEventAttributes, "id" | "payload"> {}

class ChatEvent
  extends Model<ChatEventAttributes, ChatEventCreationAttributes>
  implements ChatEventAttributes
{
  public id!: number;
  public conversationId!: number;
  public eventType!: "message_sent" | "reply_generated" | "lead_detected" | "blocked_message" | "error";
  public payload!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ChatEvent.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    conversationId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "conversations",
        key: "id",
      },
    },
    eventType: {
      type: DataTypes.ENUM(
        "message_sent",
        "reply_generated",
        "lead_detected",
        "blocked_message",
        "error"
      ),
      allowNull: false,
    },
    payload: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "chat_events",
    modelName: "ChatEvent",
  }
);

Conversation.hasMany(ChatEvent, {
  foreignKey: "conversationId",
  as: "events",
  onDelete: "CASCADE",
});

ChatEvent.belongsTo(Conversation, {
  foreignKey: "conversationId",
  as: "conversation",
});

export default ChatEvent;