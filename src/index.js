"use strict";

const AWS = require("aws-sdk");
const helpers = require("@moggiez/moggies-lambda-helpers");
const auth = require("@moggiez/moggies-auth");
const db = require("@moggiez/moggies-db");

const { Handler } = require("./handler");
const { InternalHandler } = require("./internalHandler");

const TABLE_CONFIG = {
  tableName: "organisations",
  hashKey: "OrganisationId",
  sortKey: "UserId",
  indexes: {
    UserOrganisations: {
      hashKey: "UserId",
      sortKey: "OrganisationId",
    },
  },
};

const DEBUG = false;

const getRequest = (event) => {
  const user = auth.getUserFromEvent(event);
  const request = helpers.getRequestFromEvent(event);
  request.user = user;

  return request;
};

exports.handler = async function (event, context, callback) {
  const response = helpers.getResponseFn(callback);

  if (DEBUG) {
    response(200, event);
  }

  const table = new db.Table({ config: TABLE_CONFIG, AWS });

  if ("isInternal" in event && event.isInternal) {
    if (DEBUG) {
      return event;
    }

    const internalHandler = new InternalHandler({ table });
    return await internalHandler.handle(event);
  } else {
    const request = getRequest(event);
    const handler = new Handler({ table });
    await handler.handle(request, response);
  }
};
