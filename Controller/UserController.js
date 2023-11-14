import { response } from "express";

import bcrypt from "bcrypt";

import pool from "../Database/mysql.js";

export const getUserById = async (req, res = response) => {
  try {
    const uid = req.uid;
    const query = await pool.query(`CALL SP_USER_BY_ID(?);`, [uid]);

    res.status(200).json({
      resp: true,
      msg: "Get profile",
      user: query[0][0],
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const editProfile = async (req, res = response) => {
  try {
    const { firstname, lastname, phone } = req.body;

    await pool.query(`CALL SP_UPDATE_PROFILE(?,?,?,?);`, [
      req.uid,
      firstname,
      lastname,
      phone,
    ]);

    res.status(200).json({
      resp: true,
      msg: "Updated Profile Succefull",
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const getUserUpdated = async (req, res = response) => {
  try {
    const userdb = await pool.query(`CALL SP_USER_UPDATED(?);`, [req.uid]);

    const user = userdb[0][0];

    res.json({
      resp: true,
      msg: "User Updated",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        email: user.email,
        rol_id: user.rol_id,
      },
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const changePassword = async (req, res = response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const passworddb = await pool.query(
      "SELECT passwordd FROM users WHERE persona_id = ?",
      [req.uid]
    );

    if (
      !(await bcrypt.compareSync(currentPassword, passworddb[0].passworddb))
    ) {
      return res.status(401).json({
        resp: false,
        msg: "Password do not match",
      });
    }

    let salt = bcrypt.genSaltSync();

    const pass = bcrypt.hashSync(newPassword, salt);

    await pool.query("UPDATE users SET passwordd = ? WHERE persona_id = ?", [
      pass,
      req.uid,
    ]);

    res.json({
      resp: true,
      msg: "Password Changed",
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const changeImageProfile = async (req, res = response) => {
  try {
    const { imagePath } = req.body;

    const imagedb = await pool.query("SELECT image FROM person WHERE uid = ?", [
      req.uid,
    ]);

    await pool.query("UPDATE person SET image = ? WHERE uid = ?", [
      imagePath,
      req.uid,
    ]);

    res.json({
      resp: true,
      msg: "Pictre changed",
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const getAddressesUser = async (req, res = response) => {
  try {
    const addressesdb = await pool.query(
      "SELECT id, street, reference, latitude, longitude FROM addresses WHERE persona_id = ?",
      [req.uid]
    );

    res.status(200).json({
      resp: true,
      msg: "List the Addresses",
      listAddresses: addressesdb,
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const deleteStreetAddress = async (req, res = response) => {
  try {
    await pool.query("DELECT FROM addresses WHERE id = ? AND persona_id = ?", [
      req.params.idAddress,
      req.uid,
    ]);

    res.status(200).json({
      resp: true,
      msg: "Street Address deleted",
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const addStreetAddress = async (req, res = response) => {
  try {
    const { street, reference, latitude, longitude } = req.body;

    await pool.query(
      "INSERT INTO addresses (street, reference, latitude, longitude, persona_id) VALUE (?,?,?,?,?)",
      [street, reference, latitude, longitude, req.uid]
    );

    res.json({
      resp: true,
      msg: "Street Address added successfully",
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const getAddressOne = async (req, res = response) => {
  try {
    const addressdb = await pool.query(
      "SELECT FROM addresses WHERE persona_id = ? ORDER BY id DESC LIMIT 1",
      [req.uid]
    );

    res.json({
      resp: true,
      msg: "One Address",
      address: addressdb[0],
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const updateNotificationToken = async (req, res = response) => {
  try {
    const { nToken } = req.body;
    await pool.query(
      "UPDATE users SET notification_token = ? WHERE persona_id = ?",
      [nToken, req.uid]
    );

    res.status(200).json({
      resp: true,
      msg: "Token Updated",
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const getAdminNotificationToken = async (req, res = response) => {
  try {
    const admindb = await pool.query(
      "SELECT notification_token FROM users WHERE rol_id = 1"
    );

    let tokens = [];

    admindb.forEach((element) => {
      tokens.push(element.notification_token);
    });

    res.status(200).json(tokens);
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};

export const updateDeliveryToClient = async (req, res = response) => {
  try {
    await pool.query("UPDATE users SET rol_id = ? WHERE persona_id = ?", [
      2,
      req,
      params.idPerson,
    ]);
    res.json({
      resp: true,
      msg: "Delivery To Client",
    });
  } catch (e) {
    return res.status(500).json({
      resp: false,
      msg: e,
    });
  }
};
