import { expect, test } from '@playwright/test'

test.describe('Task Management', () => {
  test('can create a task, mark it as done, and delete it', async ({
    page
  }) => {
    await page.goto('/')

    // Verify we're on the task manager page
    await expect(
      page.getByRole('heading', { name: 'Task Manager' })
    ).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/01-initial-page.png' })

    // Create a new task
    const taskTitle = `E2E Test Task`
    await page.getByPlaceholder('Add a new task').fill(taskTitle)
    await page.screenshot({ path: 'e2e/screenshots/02-filled-form.png' })
    await page.getByRole('button', { name: /add/i }).click()

    // Wait for the task to appear in the list
    const taskItem = page.getByText(taskTitle).locator('..')
    await expect(page.getByText(taskTitle)).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/03-task-created.png' })

    // Mark the task as done
    await taskItem.getByRole('button', { name: /done/i }).click()
    await page.screenshot({ path: 'e2e/screenshots/04-task-marked-done.png' })

    // Enable "Show completed tasks" to see it
    await page.getByRole('switch').click()
    await expect(
      taskItem.getByRole('button', { name: /mark as not done/i })
    ).toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/05-show-completed.png' })

    // Delete the task
    await taskItem.getByRole('button', { name: /trash/i }).click()
    await expect(page.getByText(taskTitle)).not.toBeVisible()
    await page.screenshot({ path: 'e2e/screenshots/06-task-deleted.png' })
  })
})
