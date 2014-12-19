"use strict";

module.exports = function(sequelize, DataTypes) {
	var HOST = sequelize.define('HOST', {
		ipAddr: { type: DataTypes.STRING, allowNull: false },
		hostName: { type: DataTypes.STRING, allowNull: false },
	}, {
		classMethods: {
			associate: function(models){
				HOST.hasMany(models.PING, {as: 'host_id'});
			}
		}
	});
	return HOST;
};