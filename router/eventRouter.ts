import express from "express";
import TokenVerifier from "../middlewares/TokenVerifier";
import { body, validationResult } from "express-validator";
import { IEvent } from "../models/IEvents";
import Event from "../models/Event";

const eventRouter: express.Router = express.Router();

// Logic

/**
 * @usage : Upload an Event
 * @url : http://127.0.0.1:5000/events/upload
 * @method : POST
 * @fields : name, image, price, date, info, type
 * @access : private
 */

eventRouter.post(
  "/upload",
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("image").not().isEmpty().withMessage("Image is required"),
    body("price").not().isEmpty().withMessage("Price is required"),
    body("date").not().isEmpty().withMessage("Date is required"),
    body("info").not().isEmpty().withMessage("Info is required"),
    body("type").not().isEmpty().withMessage("Type is required"),
  ],
  TokenVerifier,
  async (
    request: express.Request,
    response: express.Response
  ): Promise<any> => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(401).json({ errors: errors.array() });
    }
    try {
      let { name, image, price, date, info, type } = request.body;

      // check events with same name
      let event: IEvent | null = await Event.findOne({ name: name });
      if (event) {
        return response
          .status(401)
          .json({ errors: [{ msg: "Event Already Exists" }] });
      }
      // create an event
      event = new Event({ name, image, price, date, info, type });
      event = await event.save();

      response.status(200).json({
        message: "Upload Event Successfully",
      });
    } catch (error) {
      console.error(error);
      response.status(500).json({
        errors: [
          {
            message: error,
          },
        ],
      });
    }
  }
);

/**
 * @usage : Get ALL FREE Events
 * @url : http://127.0.0.1:5000/events/free
 * @method : GET
 * @fields : no-fields
 * @access : public
 */

eventRouter.get(
  "/free",
  async (request: express.Request, response: express.Response) => {
    try {
      let events: IEvent[] | null = await Event.find({ type: "FREE" });
      if (!events) {
        response.status(400).json({ errors: [{ msg: "No Events Found" }] });
      }

      response.status(200).json({
        events: events,
      });
    } catch (error) {
      console.error(error);
      response.status(500).json({
        errors: [
          {
            message: error,
          },
        ],
      });
    }
  }
);

/**
 * @usage : Get ALL PRO Events
 * @url : http://127.0.0.1:5000/events/pro
 * @method : GET
 * @fields : no-fields
 * @access : public
 */

eventRouter.get(
  "/pro",
  async (request: express.Request, response: express.Response) => {
    try {
      let events: IEvent[] | null = await Event.find({ type: "PRO" });
      if (!events) {
        response.status(400).json({ errors: [{ msg: "No Events Found" }] });
      }

      response.status(200).json({
        events: events,
      });
    } catch (error) {
      console.error(error);
      response.status(500).json({
        errors: [
          {
            message: error,
          },
        ],
      });
    }
  }
);

/**
 * @usage : Get A single Events
 * @url : http://127.0.0.1:5000/events/:eventId
 * @method : GET
 * @fields : no-fields
 * @access : public
 */

eventRouter.get(
  "/:eventId",
  async (request: express.Request, response: express.Response) => {
    try {
      let { eventId } = request.params;
      let event: IEvent | null = await Event.findById(eventId);
      if (!event) {
        response.status(400).json({ errors: [{ msg: "No Event Found" }] });
      }
      response.status(200).json({
        event: event,
      });
    } catch (error) {
      console.error(error);
      response.status(500).json({
        errors: [
          {
            message: error,
          },
        ],
      });
    }
  }
);

export default eventRouter;
