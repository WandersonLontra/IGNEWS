import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '../../../services/stripe';
import { getSession } from 'next-auth/client';


import { fauna } from '../../../services/fauna';
import { query as q } from 'faunadb';

type User = {
    ref: {
        id: string;
    }
    data: {
        stripe_customer_id: string;
    }
}

const Subscribe = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {

        const session = await getSession({ req });


        const currentUser = await fauna.query<User>(
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(session.user.email)
                )
            )
        )

        let customerId = currentUser.data.stripe_customer_id;

        if (!customerId) {

            const stripeCustomer = await stripe.customers.create({
                email: session.user.email,
            })


            await fauna.query(
                q.Update(
                    q.Ref(q.Collection('users'), currentUser.ref.id),
                    {
                        data: {
                            stripe_customer_id: stripeCustomer.id,
                        }
                    }

                )
            )

            customerId = stripeCustomer.id
        } 



        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [
                { price: 'price_1JnCRAJI9lHomk5MjEcy92zE', quantity: 1 },
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
        })

        return res.status(200).json({ sessionId: stripeCheckoutSession.id })

    } else {
        res.setHeader('Allow', 'POST');

        res.status(405).end('Method not allowed!');
    }
}

export default Subscribe