import React from 'react';

function About() {
    return (
        <div className='container mt-5'>

            <div className='card shadow p-4'  id='aboutcontainer'>

                <h1 className='text-info text-center'><b>About Elite Movers Sacco</b></h1>
                    
                

                <p className='mt-4 text-white'>
                    Elite Movers SACCO is a trusted transport company
                    providing safe, reliable, and comfortable travel
                    services across Kenya.
                </p>

                <p className='text-info'>
                   <b>We specialize in routes connecting:</b>
                </p>

                <ul className='text-secondary'>
                    <li>Nairobi</li>
                    <li>Mombasa</li>
                    <li>Isiolo</li>
                    <li>Karatina</li>
                    <li>Nanyuki</li>
                    <li>lamu</li>

                </ul>

                <p className='text-white'>
                    Our mission is to provide affordable and secure
                    transport services with easy online booking and
                    MPESA payment integration.
                </p>

                <p className='text-info'>
                    <b>Contact Support:</b>
                </p>

                <ul className='text-secondary'>
                    <li>Phone: 0719330833</li>
                    <li>Email: elitemovers@gmail.com</li>
                </ul>

            </div>

        </div>
    );
}

export default About;