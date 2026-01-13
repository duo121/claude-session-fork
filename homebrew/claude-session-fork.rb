class ClaudeSessionFork < Formula
  desc "Fork Claude Code sessions at any conversation point"
  homepage "https://github.com/duo121/claude-session-fork"
  url "https://github.com/duo121/claude-session-fork/archive/refs/tags/v1.0.0.tar.gz"
  sha256 ""
  license "MIT"

  depends_on "node"

  def install
    system "npm", "install", *Language::Node.std_npm_install_args(libexec)
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    assert_match "claude-session-fork", shell_output("#{bin}/sfork --help")
  end
end
