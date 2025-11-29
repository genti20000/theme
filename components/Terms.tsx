
import React from 'react';

const Terms: React.FC = () => {
  const termsData = [
    { title: "Age Restriction:", content: "– Our venue is strictly for guests aged 18 and over.\n– Valid photo ID is required for entry.\n– Anyone under 18 will be refused entry, even if accompanied by an adult. No refunds will be given in such cases." },
    { title: "Booking Times:", content: "– You will be notified during the booking process \n– All guests must vacate the premises no later than closing time." },
    { title: "Reservation Duration:", content: "– Each regular booking slot is 2 hours" },
    { title: "Reservation Policy:", content: "– Reservations must be made in advance via our official booking channels.\n– All reservations are subject to confirmation and availability.\n– Full pre-payment is required to secure your booking." },
    { title: "Cancellation and Credit Policy:", content: "– For bookings between January and August, cancellations must be made at least 21 working days in advance.\n– For bookings between September and December, cancellations must be made at least 28 working days in advance.\n– Cancellations outside these timeframes will result in loss of deposit or full payment.\n– We do not offer refunds for reduced group sizes, but if notified 5 working days in advance, a credit note may be issued (valid for 6 months, subject to availability)." },
    { title: "Changes in Group Size:", content: "– No refunds are provided for fewer guests than originally booked.\n– Credit notes may be issued if we are informed at least 5 working days before the booking.\n– Credit is not guaranteed and is at our discretion.\n– No-shows or last-minute changes within 5 five working days are not eligible for credit." },
    { title: "Late Arrivals:", content: "– Arrive promptly for your booking.\n– If running late, contact us. We’ll try to accommodate you, but your full slot isn’t guaranteed." },
    { title: "Behaviour and Conduct:", content: "– Respectful, responsible behaviour is required.\n– Disruptive or inappropriate behaviour may result in removal without a refund." },
    { title: "Alcohol and Food Policy:", content: "– Alcohol is served in accordance with the law.\n– Valid photo ID is required for alcohol service.\n– No outside food or drink is allowed.\n– Food and beverages are available for purchase on-site." },
    { title: "Damage and Liability:", content: "– Guests are responsible for any damage caused.\n– We reserve the right to charge for damages via the card used to book." },
    { title: "Safety, Accessibility and Security:", content: "– Follow staff instructions during emergencies.\n– Some rooms are located on upper floors and accessible only by stairs – there is no lift.\n– If you are pregnant, have limited mobility, or accessibility requirements, please contact us before booking.\n– We will try our best to accommodate you, subject to availability.\n– CCTV is in operation throughout the venue for safety and security." },
    { title: "Privacy and Data Collection:", content: "– Your personal data is collected and handled in line with data protection laws.\n– By booking, you agree to our privacy policy." },
    { title: "Changes to Reservations:", content: "– We reserve the right to amend bookings due to unforeseen circumstances.\n– You will be notified as early as possible in such cases." }
  ];

  return (
    <section className="bg-black min-h-screen py-20 md:py-28 text-white relative">
       {/* Background Accent */}
       <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[150px] pointer-events-none"></div>
       <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-900/20 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">Terms & Conditions</h1>
        
        <div className="bg-zinc-900/80 p-8 rounded-3xl border border-zinc-800 backdrop-blur-sm mb-12">
            <p className="text-gray-300 text-lg leading-relaxed text-center">
                Please read these Terms and Conditions carefully before making a reservation with us. By booking with us, you agree to abide by the following terms and conditions:
            </p>
        </div>

        <div className="space-y-8 mb-12">
          {termsData.map((term, index) => (
            <div key={index} className="bg-zinc-900/80 p-8 rounded-3xl border border-zinc-800 backdrop-blur-sm hover:border-zinc-700 transition-colors">
              <h3 className="text-xl md:text-2xl font-bold text-yellow-400 mb-4">{term.title}</h3>
              <div className="text-gray-300 leading-relaxed whitespace-pre-line text-base md:text-lg">{term.content}</div>
            </div>
          ))}
        </div>

        <div className="bg-zinc-900/80 p-8 rounded-3xl border border-zinc-800 backdrop-blur-sm text-center">
            <p className="text-gray-300 text-lg leading-relaxed">
                By booking with us, you acknowledge that you have read and understood these Terms and Conditions and agree to comply with them. We reserve the right to update these Terms and Conditions at any time, and it is your responsibility to review them before making a reservation.
            </p>
        </div>
      </div>
    </section>
  );
};

export default Terms;
