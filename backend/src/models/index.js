import User from './User.js';
import Address from './Address.js';
import RateCard from './RateCard.js';
import Shipment from './Shipment.js';
import TrackingEvent from './TrackingEvent.js';
import Payment from './Payment.js';

User.hasMany(Address, { foreignKey: 'userId', as: 'addresses', onDelete: 'CASCADE' });
Address.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Shipment, { foreignKey: 'userId', as: 'shipments', onDelete: 'CASCADE' });
Shipment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Shipment.belongsTo(Address, { foreignKey: 'senderAddressId', as: 'sender' });
Shipment.belongsTo(Address, { foreignKey: 'receiverAddressId', as: 'receiver' });

Shipment.hasMany(TrackingEvent, { foreignKey: 'shipmentId', as: 'trackingEvents', onDelete: 'CASCADE' });
TrackingEvent.belongsTo(Shipment, { foreignKey: 'shipmentId', as: 'shipment' });

Shipment.hasOne(Payment, { foreignKey: 'shipmentId', as: 'payment', onDelete: 'CASCADE' });
Payment.belongsTo(Shipment, { foreignKey: 'shipmentId', as: 'shipment' });

export { User, Address, RateCard, Shipment, TrackingEvent, Payment };
