"use strict";

module.exports = function(sequelize, DataTypes) {
	var CONFIG = sequelize.define('CONFIG', {
		key: { type: DataTypes.STRING, allowNull: false },
		value: { type: DataTypes.STRING, allowNull: false }
	});
	return CONFIG;
};