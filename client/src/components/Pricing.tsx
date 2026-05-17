
import { PricingTable } from '@clerk/react';
import Title from './Title';


export default function Pricing() {

    return (
        <section id="pricing" className="py-20 2xl:py-32 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent pointer-events-none" />
            <div className="max-w-6xl mx-auto px-4">

                <Title
                    title="Pricing"
                    heading="Pricing Plans"
                    description="Our pricings plans are simple, transparent and 
                    flexible> Choose the plan that best suits your needs."
                />

                <div className="flex flex-wrap items-center justify-center max-w-5xl mx-auto">
                    <PricingTable appearance={{
                        variables: {
                            colorBackgroud: 'none'
                        },
                        elements: {
                            pricingTableCardBody: 'bg-white/6',
                            pricingTableCardHeader: 'bg-white/10',
                            switchThumb: 'bg-white'
                        }
                    }} />


                </div>
            </div>
        </section>
    );
};