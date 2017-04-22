import { Route } from '@angular/router';
import { MainPageComponent } from './MainPage/MainPage.component';
import { TubeListPageComponent } from './TubeListPage/TubeListPage.component';
import { TubePageComponent } from './TubePage/TubePage.component';
import { SearchResultPageComponent } from './SearchResultPage/SearchResultPage.component';
import { MainCategoryPageComponent } from './MainCategoryPage/MainCategoryPage.component';
import { TubeListCategoryPageComponent } from './TubeListCategoryPage/TubeListCategoryPage.component';
import { RedirectPageComponent } from './RedirectPage/RedirectPage.component';
import { ContactPageComponent } from './ContactPage/ContactPage.component';
import { PrivacyPageComponent } from './PrivacyPage/PrivacyPage.component';
import { FavoritePageComponent } from './FavoritePage/FavoritePage.component';


export const routes: Route[] = [
    { path: '', component: MainPageComponent },
    { path: 'tubelist', component: TubeListPageComponent },
    { path: 'redirect', component: RedirectPageComponent },
    { path: 'contact', component: ContactPageComponent },
    { path: 'privacy', component: PrivacyPageComponent },
    { path: 'favorite', component: FavoritePageComponent },
    { path: 'tube/:tubeId', component: TubePageComponent },
    { path: 'search/:searchName', component: SearchResultPageComponent },
    { path: 'category/:categoryName', component: MainCategoryPageComponent },
    { path: 'tubelist/category/:categoryName', component: TubeListCategoryPageComponent }
];