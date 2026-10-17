import React from "react";
import { render, screen, act } from "@testing-library/react";
import { describe, test, expect, beforeEach, beforeAll, afterAll } from "vitest";
import { LanguageProvider, useLanguage } from "./language-context";

// Simple test component to consume the hook
function TestComponent() {
  const { language, setLanguage, t, dir } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <span data-testid="dir">{dir}</span>
      <span data-testid="home-translation">{t("nav.home")}</span>
      <button data-testid="btn-en" onClick={() => setLanguage("en")}>
        Change to English
      </button>
    </div>
  );
}

describe("LanguageContext & i18n", () => {
  let originalLanguage: string;

  beforeAll(() => {
    originalLanguage = window.navigator.language;
  });

  afterAll(() => {
    Object.defineProperty(window.navigator, 'language', {
      value: originalLanguage,
      configurable: true
    });
  });

  beforeEach(() => {
    // Clear localStorage before each test
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
    // Mock navigator.language to be non-english (so it defaults to 'ar')
    Object.defineProperty(window.navigator, 'language', {
      value: 'ar-SY',
      configurable: true
    });
  });

  test("should render with Arabic as default language", async () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    // Wait for language state to resolve (due to async microtask in LanguageProvider)
    const langSpan = await screen.findByTestId("lang");

    expect(langSpan.textContent).toBe("ar");
    expect(screen.getByTestId("dir").textContent).toBe("rtl");
    expect(screen.getByTestId("home-translation").textContent).toBe("الرئيسية");
  });

  test("should change language and translate when setLanguage is called", async () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    // Wait for initial render resolution
    await screen.findByTestId("lang");

    const button = screen.getByTestId("btn-en");
    
    act(() => {
      button.click();
    });

    expect(screen.getByTestId("lang").textContent).toBe("en");
    expect(screen.getByTestId("dir").textContent).toBe("ltr");
    expect(screen.getByTestId("home-translation").textContent).toBe("Home");
  });
});
