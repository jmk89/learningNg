import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AuthInterceptorService } from "./auth/auth-interceptor.service";
import { RecipeResolver } from "./recipes/recipe-detail/recipe-resolver.service";
import { RecipeService } from "./services/recipe.service";
import { ShoppingListService } from "./services/shopping-list.service";

@NgModule({
    providers: [
        RecipeResolver, 
        ShoppingListService,
        RecipeService,
        {
            provide: HTTP_INTERCEPTORS, 
            useClass: AuthInterceptorService, 
            multi: true
        }
    ]
})
export class CoreModule {}