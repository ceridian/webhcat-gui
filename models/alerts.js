"use strict";

module.exports = function(sequelize, DataTypes) {
	var ALERT = sequelize.define('ALERT', {
		type: { type: DataTypes.STRING, allowNull: false },
		alertName: { type: DataTypes.STRING, allowNull: false },
		from: { type: DataTypes.STRING, allowNull: false },
		description: DataTypes.STRING,
		ackBy: DataTypes.STRING,
		ackTime: DataTypes.DATE
	});
	return ALERT;
};