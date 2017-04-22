import { Console } from '@angular/core/src/console';
import { Meteor } from 'meteor/meteor';
import { TubesCollection } from "../both/collections/tubes.collection";
import { TubesCollectionSummery } from "../both/collections/tubes.collection";
import { Session } from 'meteor/session'
import { ServiceConfiguration } from 'meteor/service-configuration'


ServiceConfiguration.configurations.upsert(
  { service: 'google' },
    {
      $set: {
        clientId: 'cleintId',
        loginStyle: 'popup',
        secret: 'secert',
      },
    }
);

Meteor.startup(() => {
  // loadParties();
  Meteor.users.allow({
      insert: function (userId, doc) {
             //Normally I would check if (this.userId) to see if the method is called by logged in user or guest
             //you can also add some checks here like user role based check etc.,
             return true;
          },

      update: function (userId, doc, fieldNames, modifier) {
             //similar checks like insert
             return true;
          },

      remove: function (userId, doc) {
             //similar checks like insert
             return true;
          }

  });
    Meteor.publish("getUserData", function () {
        return Meteor.users.find({_id: this.userId});
    });

    Meteor.publish('mainPage', function(lang) {
          var query = {"category":"main"};
          var queryLang = Object.assign(query, {"language":lang} );

          return TubesCollection.find(queryLang , {limit: 5});
        });

    Meteor.publish('mainCategoryPage', function(lang, categoryName) {
          var query = {"category":categoryName};
          var queryLang = Object.assign(query, {"language":lang} );

          return TubesCollection.find(queryLang , {limit: 5});
        });

    Meteor.publish('searchResultPage', function(lang, searchName) {
          var query = { "tubeName" : { '$regex' : '.*' + searchName + '.*'} };
          var queryLang = Object.assign(query, {"language":lang} );

          return TubesCollectionSummery.find(queryLang , {limit: 60});
        });

    Meteor.publish('tubeListCategoryPage', function(lang, categoryName) {
      var query = {"category":categoryName};
      var queryLang = Object.assign(query, {"language":lang} );

      return TubesCollectionSummery.find(queryLang , {limit: 60});
    });

    Meteor.publish('tubeListPage', function(lang) {
      var query = {};
      var queryLang = Object.assign(query, {"language":lang} );

      return TubesCollectionSummery.find(queryLang , {limit: 60});
    });

    Meteor.publish('tubePage', function(lang, searchId) {
        return TubesCollection.find(searchId, {limit: 1});
    });
});
