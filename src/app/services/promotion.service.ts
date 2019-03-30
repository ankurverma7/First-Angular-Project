import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PROMOTION } from '../shared/promotions';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor() { }

  getPromotions(): Promotion[] {
    return PROMOTION;
  }

  getPromotion(id: string): Promotion {
    return PROMOTION.filter((promo) => (promo.id === id))[0];
  }

  getFeaturedPromotion(): Promotion {
    return PROMOTION.filter((promotion) => promotion.featured)[0];
  }
}
