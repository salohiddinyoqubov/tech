package service

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/abs-platform/api/internal/model"
	"github.com/abs-platform/api/internal/repository"
	"github.com/abs-platform/api/pkg/auth"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrEmailExists        = errors.New("email already exists")
	ErrUsernameExists     = errors.New("username already exists")
	ErrUserNotFound       = errors.New("user not found")
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrInvalidToken       = errors.New("invalid token")
)

// AuthService handles authentication logic
type AuthService struct {
	userRepo   repository.UserRepository
	jwtManager *auth.JWTManager
}

// NewAuthService creates a new auth service
func NewAuthService(userRepo repository.UserRepository, jwtManager *auth.JWTManager) *AuthService {
	return &AuthService{
		userRepo:   userRepo,
		jwtManager: jwtManager,
	}
}

// RegisterInput represents registration input
type RegisterInput struct {
	Email    string
	Username string
	Password string
	FullName string
	Language string
}

// Register creates a new user account
func (s *AuthService) Register(ctx context.Context, input RegisterInput) (*auth.TokenPair, *model.User, error) {
	// Check if email exists
	existing, _ := s.userRepo.FindByEmail(ctx, input.Email)
	if existing != nil {
		return nil, nil, ErrEmailExists
	}

	// Check if username exists
	existing, _ = s.userRepo.FindByUsername(ctx, input.Username)
	if existing != nil {
		return nil, nil, ErrUsernameExists
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, nil, err
	}

	// Set default language
	if input.Language == "" {
		input.Language = "en"
	}

	// Create user
	user := &model.User{
		ID:            uuid.New(),
		Email:         strings.ToLower(input.Email),
		Username:      strings.ToLower(input.Username),
		PasswordHash:  string(hashedPassword),
		FullName:      input.FullName,
		Role:          model.RoleRookie,
		Karma:         0,
		TrustScore:    50, // Default trust score
		PreferredLang: input.Language,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	if err := s.userRepo.Create(ctx, user); err != nil {
		return nil, nil, err
	}

	// Generate tokens
	tokens, err := s.jwtManager.GenerateTokenPair(user.ID, user.Username, user.Email, string(user.Role))
	if err != nil {
		return nil, nil, err
	}

	return tokens, user, nil
}

// Login authenticates a user
func (s *AuthService) Login(ctx context.Context, email, password string) (*auth.TokenPair, *model.User, error) {
	user, err := s.userRepo.FindByEmail(ctx, strings.ToLower(email))
	if err != nil {
		return nil, nil, ErrUserNotFound
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, nil, ErrInvalidCredentials
	}

	// Update last active
	now := time.Now()
	user.LastActiveAt = &now
	_ = s.userRepo.Update(ctx, user)

	// Generate tokens
	tokens, err := s.jwtManager.GenerateTokenPair(user.ID, user.Username, user.Email, string(user.Role))
	if err != nil {
		return nil, nil, err
	}

	return tokens, user, nil
}

// RefreshTokens generates new tokens from a refresh token
func (s *AuthService) RefreshTokens(ctx context.Context, refreshToken string) (*auth.TokenPair, error) {
	claims, err := s.jwtManager.ValidateRefreshToken(refreshToken)
	if err != nil {
		return nil, ErrInvalidToken
	}

	// Get fresh user data
	user, err := s.userRepo.FindByID(ctx, claims.UserID)
	if err != nil {
		return nil, ErrUserNotFound
	}

	// Generate new tokens
	tokens, err := s.jwtManager.GenerateTokenPair(user.ID, user.Username, user.Email, string(user.Role))
	if err != nil {
		return nil, err
	}

	return tokens, nil
}

// GetUserByID returns a user by ID
func (s *AuthService) GetUserByID(ctx context.Context, id uuid.UUID) (*model.User, error) {
	return s.userRepo.FindByID(ctx, id)
}

// ChangePassword changes user's password
func (s *AuthService) ChangePassword(ctx context.Context, userID uuid.UUID, oldPassword, newPassword string) error {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return ErrUserNotFound
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(oldPassword)); err != nil {
		return ErrInvalidCredentials
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.PasswordHash = string(hashedPassword)
	user.UpdatedAt = time.Now()

	return s.userRepo.Update(ctx, user)
}
