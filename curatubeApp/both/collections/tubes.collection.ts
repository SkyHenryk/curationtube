import { MongoObservable } from "meteor-rxjs";
import {Tube} from "../models/tube.model";

export const TubesCollection = new MongoObservable.Collection<Tube>("tubeList");
export const TubesCollectionSummery = new MongoObservable.Collection<Tube>("tubeListSummery");
