import { rest } from 'msw'

export const handlers = [
  rest.get('/deliveries', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          name: 'iPhone',
          volume: 34,
          price: 9
        }
      ])
    )
  })
]
