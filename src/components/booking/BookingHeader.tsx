
interface BookingHeaderProps {
  title: string;
  description: string;
}

const BookingHeader = ({ title, description }: BookingHeaderProps) => {
  return (
    <section className="bg-gradient-to-r from-primary/90 to-secondary/90 text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-xl max-w-2xl mx-auto">
          {description}
        </p>
      </div>
    </section>
  );
};

export default BookingHeader;
