import { AuthProvider } from "../auth/auth-context"
import "../css/main.css"

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
