function Home() {
  return (
    <div>
      <h1>Welcome to the <span style={{ color: 'var(--red)'}}>Supermarket</span> List</h1>
      <p>Select recipes and generate a smart merged ingredient list!</p>
      <img src="products.jpg" alt="supermarket" className="supermarket-image" />
    </div>
  );
}

export default Home;