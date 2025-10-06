import citySkyline from "@/assets/city-skyline.jpg";

const WaveBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <img 
        src={citySkyline} 
        alt="City skyline" 
        className="w-full h-full object-cover"
      />
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.45))'
        }}
      />
    </div>
  );
};

export default WaveBackground;
