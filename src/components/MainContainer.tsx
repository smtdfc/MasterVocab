import "@/styles/container.css";

export default function MainContainer({children}){
  return (
    <div className="container">
      {children}
    </div>
  );
}