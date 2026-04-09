function ThemeCard({ theme }) {
  return (
    <div className="theme-card">
      <img src={theme.image} alt={theme.title} />
      <h3>{theme.title}</h3>
      <p>{theme.description}</p>
    </div>
  );
}

export default ThemeCard;