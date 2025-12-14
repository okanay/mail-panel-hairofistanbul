import { useState } from 'react'
import { DropdownWrapper } from './wrapper'

export default function DropdownDemo() {
  const [value, setValue] = useState('')

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <DropdownWrapper
        render={({ triggerRef, toggle }) => (
          <input
            id="dropdown-test-input"
            name="dropdown-test-input"
            ref={triggerRef}
            onFocus={toggle}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          />
        )}
        className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
      >
        {({ triggerWidth, close }) => (
          <div
            style={{
              width: triggerWidth,
            }}
          >
            <button
              onClick={() => {
                setValue('opt-1')
                close()
              }}
              className="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
            >
              Option 1
            </button>
            <button
              onClick={() => {
                setValue('opt-2')
                close()
              }}
              className="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
            >
              Option 2
            </button>
            <button
              onClick={() => {
                setValue('opt-3')
                close()
              }}
              className="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
            >
              Option 3
            </button>
          </div>
        )}
      </DropdownWrapper>
      <div className="flex items-center gap-x-4">
        {/* Nested Dropdown */}
        <DropdownWrapper
          render={({ triggerRef, isOpen, toggle }) => (
            <button
              ref={triggerRef}
              onClick={toggle}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              Nested Dropdown {isOpen ? '▲' : '▼'}
            </button>
          )}
          className="rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          {({ triggerWidth: layer1 }) => (
            <div
              style={{
                width: layer1,
              }}
              className="space-y-1"
            >
              <button className="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100">
                Kişi Sayısı
              </button>

              {/* Inner Dropdown */}
              <DropdownWrapper
                render={({ triggerRef, isOpen, toggle }) => (
                  <button
                    ref={triggerRef}
                    onClick={toggle}
                    className="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    Ülke Seç {isOpen ? '▲' : '▼'}
                  </button>
                )}
                className="ml-4 rounded-lg border border-gray-200 bg-white shadow-lg"
              >
                {({ triggerWidth: layer2, close }) => (
                  <div
                    style={{
                      width: layer2,
                    }}
                    className="space-y-1"
                  >
                    <button
                      onClick={close}
                      className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100"
                    >
                      🇹🇷 Türkiye with Close
                    </button>
                    <button className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100">
                      🇺🇸 USA
                    </button>
                    <button className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100">
                      🇩🇪 Germany
                    </button>

                    {/* Deeply Nested */}
                    <DropdownWrapper
                      render={({ triggerRef, isOpen, toggle }) => (
                        <button
                          ref={triggerRef}
                          onClick={toggle}
                          className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100"
                        >
                          Şehir Seç {isOpen ? '▲' : '▼'}
                        </button>
                      )}
                      className="ml-8 rounded-lg border border-gray-200 bg-white shadow-lg"
                    >
                      {({ triggerWidth: layer3 }) => (
                        <div
                          style={{
                            width: layer3,
                          }}
                          className="space-y-1"
                        >
                          <button className="w-full rounded px-2 py-1 text-left text-xs hover:bg-gray-100">
                            İstanbul
                          </button>
                          <button className="w-full rounded px-2 py-1 text-left text-xs hover:bg-gray-100">
                            Ankara
                          </button>
                          <button className="w-full rounded px-2 py-1 text-left text-xs hover:bg-gray-100">
                            İzmir
                          </button>
                        </div>
                      )}
                    </DropdownWrapper>
                  </div>
                )}
              </DropdownWrapper>

              <button className="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100">
                Tarih Seç
              </button>
            </div>
          )}
        </DropdownWrapper>

        {/* Simple Dropdown */}
        <DropdownWrapper
          render={({ triggerRef, isOpen, toggle }) => (
            <button
              ref={triggerRef}
              onClick={toggle}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              Simple Dropdown {isOpen ? '▲' : '▼'}
            </button>
          )}
          className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          {({ triggerWidth }) => (
            <div
              style={{
                width: triggerWidth,
              }}
            >
              <button className="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100">
                Option 1
              </button>
              <button className="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100">
                Option 2
              </button>
              <button className="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100">
                Option 3
              </button>
            </div>
          )}
        </DropdownWrapper>
      </div>
    </div>
  )
}
