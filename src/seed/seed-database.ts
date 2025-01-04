import { initialData } from './seed'
import prisma from '../lib/prisma'

async function main() {
  //? Delete data
  await prisma.invoice.deleteMany()

  //? Add a invoices
  const { invoices } = initialData

  await prisma.invoice.createMany({
    data: invoices,
  })

  console.log('Seed executed...')
}

;(() => {
  if (process.env.NODE_ENV === 'production') return
  main()
})()