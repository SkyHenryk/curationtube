import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { HeadMenuComponent } from "./share/HeadMenu/HeadMenu.component";
import { NavMenuComponent } from "./share/NavMenu/NavMenu.component";
import { NavCategoryComponent } from "./share/NavCategory/NavCategory.component";
import { NavTubeListCategoryComponent } from "./share/NavTubeListCategory/NavTubeListCategory.component";
import { FooterSectionComponent } from "./share/FooterSection/FooterSection.component";
import { TubeDetailComponent } from "./share/TubeDetail/TubeDetail.component";
import { TubeListComponent } from "./share/TubeList/TubeList.component";
import { TubeInfoComponent } from "./share/TubeList/TubeInfo/TubeInfo.component";
import { VideoInfoComponent } from "./share/TubeList/TubeInfo/videoInfo/videoInfo.component";
import { timeSplitTPipe } from "./share/TubeList/TubeInfo/videoInfo/videoInfo.pipe";
import { playtimeTPipe } from "./share/TubeList/TubeInfo/videoInfo/videoInfo.pipe";
import { likeCountCommaPipe } from "./share/TubeList/TubeInfo/videoInfo/videoInfo.pipe";
import { cutDescriptionPipe } from "./share/TubeList/TubeInfo/videoInfo/videoInfo.pipe";
import { MainCategoryPageComponent } from './MainCategoryPage/MainCategoryPage.component';
import { MainPageComponent } from './MainPage/MainPage.component';
import { TubeListPageComponent } from './TubeListPage/TubeListPage.component';
import { TubeListCategoryPageComponent } from './TubeListCategoryPage/TubeListCategoryPage.component';
import { TubeTitleListComponent } from './share/TubeTitleList/TubeTitleList.component';
import { TubePageComponent } from './TubePage/TubePage.component';
import { SearchResultPageComponent } from './SearchResultPage/SearchResultPage.component';
import { RedirectPageComponent } from './RedirectPage/RedirectPage.component';
import { ContactPageComponent } from './ContactPage/ContactPage.component';
import { PrivacyPageComponent } from './PrivacyPage/PrivacyPage.component';
import { FavoritePageComponent } from './FavoritePage/FavoritePage.component';
import { AccountsModule } from 'angular2-meteor-accounts-ui';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    AccountsModule,
  ],
  declarations: [
    AppComponent,
    ContactPageComponent,
    RedirectPageComponent,
    NavMenuComponent,
    NavCategoryComponent,
    NavTubeListCategoryComponent,
    HeadMenuComponent,
    TubeInfoComponent,
    VideoInfoComponent,
    FooterSectionComponent,
    TubeListComponent,
    TubeListCategoryPageComponent,
    MainPageComponent,
    TubePageComponent,
    SearchResultPageComponent,
    TubeListPageComponent,
    TubeTitleListComponent,
    TubeDetailComponent,
    MainCategoryPageComponent,
    FavoritePageComponent,
    timeSplitTPipe,
    playtimeTPipe,
    likeCountCommaPipe,
    cutDescriptionPipe,
    PrivacyPageComponent,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
