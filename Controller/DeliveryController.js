import { response } from "express";

import pool from "../Database/mysql.js";

export const getAllDelivery = async (req, res = response) => {
  try {
    let deliverydb = await pool.query(`CALL SP_ALL_DELIVERYS();`);

    res.status(200).json({
      resp: true,
      msg: "GET ALL DELIVERY",
      delivery: deliverydb[0],
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};
