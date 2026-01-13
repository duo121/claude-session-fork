# Homebrew formula for sfork
# To use: brew tap user/sfork && brew install sfork

class Sfork < Formula
  desc "Fork Claude Code sessions at any conversation point"
  homepage "https://sfork.vercel.app"
  url "https://registry.npmjs.org/sfork/-/sfork-1.0.0.tgz"
  sha256 "PLACEHOLDER_SHA256"
  license "MIT"

  depends_on "node@18"

  def install
    system "npm", "install", *Language::Node.std_npm_install_args(libexec)
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    assert_match "sfork", shell_output("#{bin}/sfork --help 2>&1", 1)
  end
end
