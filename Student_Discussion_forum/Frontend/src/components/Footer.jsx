import './Footer.css'

const Footer = () => (
  <footer className="app-footer">
    <p>© {new Date().getFullYear()} Student Discussion Forum</p>
    <p>Built with the MERN stack · Real-time powered by Socket.IO</p>
  </footer>
)

export default Footer