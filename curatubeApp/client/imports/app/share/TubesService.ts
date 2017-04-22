import { Injectable } from "@angular/core";
import { ObservableCursor } from "meteor-rxjs";
import {Tube, ItemDict} from "../../../../both/models/tube.model";
import { TubesCollection } from "../../../../both/collections/tubes.collection";
import { TubesCollectionSummery } from "../../../../both/collections/tubes.collection";
import { Session } from 'meteor/session'

@Injectable()
export class TubesDataService {
  private data: ObservableCursor<Tube>;
  private queryDict: ItemDict;
  private languageFromSession: any;
  constructor() {
    Session.setDefault("language", "en")
    this.languageFromSession = Session.get("language")
  }
  public setLanguage(lang){
    Session.set("language", lang)
  }

  public getLanguage(){
    return Session.get("language");
  }

  public getData(query?, limit?,fields?): ObservableCursor<Tube> {

    if (query==null) {query = {}};
    if (limit==null) {limit = 6};
    var optionDict = {limit: limit}
    if (fields!=null) {
      optionDict = Object.assign(optionDict, fields);
    };
    this.queryDict = Object.assign(query, {"language":Session.get("language")});
    this.data = TubesCollection.find(this.queryDict , optionDict);
    return this.data;
  }
  public getDataSummery(query?, limit?,fields?): ObservableCursor<Tube> {

    if (query==null) {query = {}};
    if (limit==null) {limit = 6};
    var optionDict = {limit: limit}
    if (fields!=null) {
      optionDict = Object.assign(optionDict, fields);
    };
    this.queryDict = Object.assign(query, {"language":Session.get("language")});
    this.data = TubesCollectionSummery.find(this.queryDict , optionDict);
    return this.data;
  }
}
