# Homebrew formula for claude-session-fork
# To use: brew tap duo121/claude-session-fork && brew install claude-session-fork

class ClaudeSessionFork < Formula
  desc "Fork Claude Code sessions at any conversation point"
  homepage "https://claude-session-fork.vercel.app"
  url "https://registry.npmjs.org/claude-session-fork/-/claude-session-fork-1.0.0.tgz"
  sha256 "PLACEHOLDER_SHA256"
  license "MIT"

  depends_on "node@18"

  def install
    system "npm", "install", *Language::Node.std_npm_install_args(libexec)
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    assert_match "claude-session-fork", shell_output("#{bin}/csfork --help")
  end
end
