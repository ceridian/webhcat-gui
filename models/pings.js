"use strict";

module.exports = function(sequelize, DataTypes) {
	var PING = sequelize.define('PING', {
		delay: { type: DataTypes.DECIMAL, allowNull: false },
		state: { type: DataTypes.STRING, allowNull: false }
	}, {
		classMethods: {
			associate: function(models){
				PING.belongsTo(models.HOST);
			}
		}
	});
	return PING;
};
