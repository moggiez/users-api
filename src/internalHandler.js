"use strict";

class InternalHandler {
  constructor({ table }) {
    const expectedTableName = "organisations";
    if (table && table.getConfig().tableName != expectedTableName) {
      throw new Error(
        `Constructor expects '${expectedTableName}' table passed. The passed table name does not match '${expectedTableName}'.`
      );
    }
    this.table = table;
  }

  handle = async (event) => {
    const actionMethod = this[event.action];
    if (!actionMethod) {
      throw Error("Not supported action.");
    }
    const actionParameters = event.parameters;

    return actionMethod(actionParameters);
  };

  getUserOrganisation = async ({ userId }) => {
    try {
      const data = await this.table.query({
        indexName: "UserOrganisations",
        hashKey: userId,
      });
      const org = await this.table.get({
        hashKey: data.Items[0].OrganisationId,
        sortKey: userId,
      });
      return org.Item;
    } catch (err) {
      console.log(err);
      return null;
    }
  };
}

exports.InternalHandler = InternalHandler;
