import { User } from '../types.js'
import { urls } from '../urls.js'
import { Nav, NavContainer, NavContent, NavLinks, NavLink } from './ui.js'

export interface Props {
  user: User | null
}

export function Navbar({ user }: Props) {
  return (
    <Nav>
      <NavContainer>
        <NavContent>
          <NavLinks>
            <NavLink href="/">Home</NavLink>
          </NavLinks>
          <NavLinks>
            {user ? (
              <>
                <NavLink href={urls.account.uri()}>Account</NavLink>
                <NavLink href={urls.logout.uri()} method="post">
                  Logout
                </NavLink>
              </>
            ) : (
              <>
                <NavLink href={urls.login.uri()}>Login</NavLink>
                <NavLink href={urls.register.uri()}>Register</NavLink>
              </>
            )}
          </NavLinks>
        </NavContent>
      </NavContainer>
    </Nav>
  )
}
