import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock axios using Vitest
vi.mock('axios');
const mockedAxios = axios as vi.Mocked<typeof axios>;

// Mock useNavigate from react-router-dom
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockedNavigate,
    };
});

describe('Login Component', () => {
    const setAuthTokenResponse = vi.fn();

    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    test('logs in user successfully', async () => {
        const fakeToken = 'fake-jwt-token';
        mockedAxios.post.mockResolvedValueOnce({ data: { token: fakeToken } });

        render(
            <MemoryRouter>
                <Login setAuthTokenResponse={setAuthTokenResponse} />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@example.com' },
        });

        fireEvent.change(screen.getByLabelText(/heslo/i), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: /přihlásit se/i }));

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith(
                'http://localhost:8081/api/auth/login',
                { email: 'test@example.com', password: 'password123' }
            );
        });

        expect(localStorage.getItem('authTokenResponse')).toBe(fakeToken);
        expect(setAuthTokenResponse).toHaveBeenCalledWith(fakeToken);
        expect(mockedNavigate).toHaveBeenCalledWith('/profile');
    });


    test('shows error message on incorrect password', async () => {
        const errorMessage = 'Chyba při přihlášení.';
        mockedAxios.post.mockRejectedValueOnce({
            response: { data: errorMessage },
        });

        render(
            <MemoryRouter>
                <Login setAuthTokenResponse={setAuthTokenResponse} />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@example.com' },
        });

        fireEvent.change(screen.getByLabelText(/heslo/i), {
            target: { value: 'wrongpassword' },
        });

        fireEvent.click(screen.getByRole('button', { name: /přihlásit se/i }));

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });

        // Assert no token saved & no navigation
        expect(localStorage.getItem('authTokenResponse')).toBeNull();
        expect(setAuthTokenResponse).not.toHaveBeenCalled();
        expect(mockedNavigate).not.toHaveBeenCalled();
    });
});
