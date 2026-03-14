"""Quick unit tests for storage and topic selection logic."""

import sys
sys.path.insert(0, ".")

from app.models.storage import (
    create_user, get_profile, apply_engagement_delta, _normalize_profile,
    ALL_TOPICS, MIN_WEIGHT, MAX_WEIGHT
)
from app.models.topic_selector import select_next_topic


def test_create_user():
    uid = create_user("test@example.com", ["Fitness", "Psychology"])
    profile = get_profile(uid)
    assert profile is not None
    assert profile["Fitness"] == 0.7
    assert profile["Psychology"] == 0.7
    assert profile["History"] == 0.1
    print("✓ create_user: profile initialized correctly")


def test_engagement_deltas():
    uid = create_user("test2@example.com", ["Neuroscience"])
    profile = get_profile(uid)

    # Like + Go Deeper + 2 messages + 45s
    updated = apply_engagement_delta(
        profile, "Neuroscience",
        liked=True, disliked=False, went_deeper=True,
        conversation_depth=2, time_on_card=45
    )
    # delta = 0.15 + 0.20 + 0.10 (2 msgs) + 0.10 (45s) = 0.55
    # base = 0.7, so raw = 1.25 -> capped at 1.0
    # But normalization may bring it down
    assert updated["Neuroscience"] > profile["Neuroscience"]
    print(f"✓ engagement like+deeper+msgs+time: {profile['Neuroscience']:.2f} → {updated['Neuroscience']:.2f}")


def test_dislike_delta():
    uid = create_user("test3@example.com", ["History"])
    profile = get_profile(uid)
    base = profile["History"]
    updated = apply_engagement_delta(
        profile, "History",
        liked=False, disliked=True, went_deeper=False,
        conversation_depth=0, time_on_card=0
    )
    assert updated["History"] < base or updated["History"] == MIN_WEIGHT
    print(f"✓ dislike delta: {base:.2f} → {updated['History']:.2f}")


def test_weight_caps():
    profile = {t: 0.9 for t in ALL_TOPICS[:5]}
    for t in ALL_TOPICS[5:]:
        profile[t] = 0.1
    updated = apply_engagement_delta(
        profile, ALL_TOPICS[0],
        liked=True, disliked=False, went_deeper=True,
        conversation_depth=5, time_on_card=60
    )
    for v in updated.values():
        assert v >= MIN_WEIGHT, f"Weight below floor: {v}"
        assert v <= MAX_WEIGHT, f"Weight above cap: {v}"
    print("✓ all weights within [MIN_WEIGHT, MAX_WEIGHT] after heavy engagement")


def test_topic_selector_distribution():
    profile = {t: 0.1 for t in ALL_TOPICS}
    profile["Fitness"] = 0.9
    profile["Psychology"] = 0.8
    profile["Neuroscience"] = 0.7

    counts: dict[str, int] = {}
    for _ in range(200):
        topic = select_next_topic(profile)
        counts[topic] = counts.get(topic, 0) + 1

    top_topics = {"Fitness", "Psychology", "Neuroscience"}
    top_count = sum(counts.get(t, 0) for t in top_topics)
    ratio = top_count / 200
    print(f"✓ 80/20 selection: top-3 topics got {ratio:.0%} of 200 picks (expect ~40-80%)")
    assert ratio > 0.3, f"Top topics not being selected enough: {ratio:.0%}"


def test_normalization():
    profile = {t: 0.95 for t in ALL_TOPICS}
    normalized = _normalize_profile(profile)
    avg = sum(normalized.values()) / len(normalized)
    assert avg <= 0.65, f"Normalization failed, avg={avg:.2f}"
    print(f"✓ normalization: avg weight {0.95:.2f} → {avg:.2f}")


if __name__ == "__main__":
    print("Running unit tests...\n")
    test_create_user()
    test_engagement_deltas()
    test_dislike_delta()
    test_weight_caps()
    test_topic_selector_distribution()
    test_normalization()
    print("\nAll tests passed!")
