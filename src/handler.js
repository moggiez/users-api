"use strict";

class Handler {
  constructor({ table }) {
    const expectedTableName = "organisations";
    if (table && table.getConfig().tableName != expectedTableName) {
      throw new Error(
        `Constructor expects '${expectedTableName}' table passed. The passed table name does not match '${expectedTableName}'.`
      );
    }
    this.table = table;
  }

  handle = async (req, res) => {
    try {
      if (req.httpMethod == "GET") {
        await this.get(req, res);
      } else {
        res(500, "Not supported.");
      }
    } catch (err) {
      res(500, err);
    }
  };

  get = async (request, response) => {
    try {
      const data = await this.table.query({
        indexName: "UserOrganisations",
        hashKey: request.user.id,
      });
      const org = await this.table.get({
        hashKey: data.Items[0].OrganisationId,
        sortKey: request.user.id,
      });
      response(200, org.Item);
    } catch (err) {
      console.log(err);
      response(500, err);
    }
  };
}

exports.Handler = Handler;
