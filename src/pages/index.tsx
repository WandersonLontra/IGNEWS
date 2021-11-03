import { GetStaticProps } from 'next';
import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';

import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({product} : HomeProps) {

  return (
    <>
      <Head>
        <title>Ig.news | Home</title>
      </Head>
      
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl Coding" />

      </main>
    </>

  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1JnCRAJI9lHomk5MjEcy92zE');

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US',{
      currency: 'USD',
      style: 'currency'
    }).format(price.unit_amount / 100),
  }
  return {
    props : {
      product
    },
    revalidate: 60 * 60 * 24, //60s * 60min  * 24h = 24horas , tempo para ser montado um novo html em segundos
  }
}

