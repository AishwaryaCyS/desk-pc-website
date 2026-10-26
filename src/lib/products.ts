// Single source of truth. The server re-prices every order from this list.
export const PRODUCTS = [
  { id: '3ft', name: '3 Foot Desk PC', pricePaise: 2500000, blurb: 'TO FILL IN: what is inside, dimensions, lead time' },
  { id: '4ft', name: '4 Foot Desk PC', pricePaise: 3500000, blurb: 'TO FILL IN: what is inside, dimensions, lead time' },
  { id: '5ft', name: '5 Foot Desk PC', pricePaise: 4500000, blurb: 'TO FILL IN: what is inside, dimensions, lead time' },
  { id: '6ft', name: '6 Foot Desk PC', pricePaise: 5900000, blurb: 'TO FILL IN: what is inside, dimensions, lead time' },
]
export const inr = (paise: number) => '₹' + (paise / 100).toLocaleString('en-IN')
